package io.sharely.app;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.google.android.material.bottomsheet.BottomSheetDialogFragment;
import com.google.firebase.FirebaseApp;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;

import java.util.HashMap;
import java.util.Map;

public class ShareHandlerBottomSheet extends BottomSheetDialogFragment {

    private Uri sharedUri;
    private String sharedText;
    private EditText tagInput;

    public static ShareHandlerBottomSheet newInstance(Intent intent) {
        ShareHandlerBottomSheet fragment = new ShareHandlerBottomSheet();
        Bundle args = new Bundle();
        args.putParcelable("sharedUri", intent.getParcelableExtra(Intent.EXTRA_STREAM));
        args.putString("sharedText", intent.getStringExtra(Intent.EXTRA_TEXT));
        args.putString("type", intent.getType());
        fragment.setArguments(args);
        return fragment;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState) {
        FirebaseApp.initializeApp(requireContext());
        View view = inflater.inflate(R.layout.activity_share_handler, container, false);

        sharedUri = getArguments().getParcelable("sharedUri");
        sharedText = getArguments().getString("sharedText");

        tagInput = view.findViewById(R.id.tag_input);

        Button shareButton = view.findViewById(R.id.share_button);
        shareButton.setOnClickListener(v -> {
            String tags = tagInput.getText().toString();
            uploadToFirebase(tags);
        });

        return view;
    }

    private void uploadToFirebase(String tags) {
        if (sharedUri != null) {
            StorageReference storageRef = FirebaseStorage.getInstance()
                    .getReference("shared_files/" + System.currentTimeMillis());

            storageRef.putFile(sharedUri)
                    .addOnSuccessListener(taskSnapshot -> storageRef.getDownloadUrl()
                            .addOnSuccessListener(uri -> saveToFirestore(uri.toString(), tags)))
                    .addOnFailureListener(e -> {
                        Toast.makeText(requireContext(), "Upload failed", Toast.LENGTH_SHORT).show();
                        dismiss();
                    });
        } else if (sharedText != null) {
            saveToFirestore(sharedText, tags);
        }
    }

    private void saveToFirestore(String fileUrl, String tags) {
        FirebaseFirestore db = FirebaseFirestore.getInstance();
        Map<String, Object> data = new HashMap<>();
        data.put("fileURL", fileUrl);
        data.put("tags", tags);
        data.put("createdAt", System.currentTimeMillis());

        db.collection("sharedItems")
                .add(data)
                .addOnSuccessListener(documentReference -> {
                    Toast.makeText(requireContext(), "Shared successfully!", Toast.LENGTH_SHORT).show();
                    dismiss(); // Close the bottom sheet
                })
                .addOnFailureListener(e -> {
                    Toast.makeText(requireContext(), "Failed to save data", Toast.LENGTH_SHORT).show();
                    dismiss();
                });
    }
}

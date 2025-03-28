package io.sharely.app;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup; 
import android.widget.Button;
import android.widget.Toast;

import com.google.firebase.FirebaseApp;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;

import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.bottomsheet.BottomSheetDialog;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ShareReceiverActivity extends Activity {
    private Intent incomingIntent;
    private String action;
    private String type;
    private TagAdapter tagAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        FirebaseApp.initializeApp(this); // ✅ Initialize Firebase
        incomingIntent = getIntent();
        action = incomingIntent.getAction();
        type = incomingIntent.getType();
        showBottomSheetWithSharedContent();
    }

    private void showBottomSheetWithSharedContent() {
        View bottomSheetView = LayoutInflater.from(this).inflate(R.layout.bottom_sheet_share, null);
        BottomSheetDialog dialog = new BottomSheetDialog(this);
        dialog.setContentView(bottomSheetView);

        dialog.setOnShowListener(dialogInterface -> {
            BottomSheetDialog bottomSheetDialog = (BottomSheetDialog) dialogInterface;
            View bottomSheetInternal = bottomSheetDialog.findViewById(com.google.android.material.R.id.design_bottom_sheet);

            if (bottomSheetInternal != null) {
                bottomSheetInternal.getLayoutParams().height = ViewGroup.LayoutParams.MATCH_PARENT;
                bottomSheetInternal.requestLayout();
            }
        });

        Button btnCancel = bottomSheetView.findViewById(R.id.btn_cancel);
        Button btnSubmit = bottomSheetView.findViewById(R.id.btn_submit);

        RecyclerView tagRecyclerView = bottomSheetView.findViewById(R.id.tag_grid);
        tagRecyclerView.setLayoutManager(new GridLayoutManager(this, 3));

        // ✅ Fetch tags from Firestore
        FirebaseFirestore db = FirebaseFirestore.getInstance();
        db.collection("tags")
                .whereEqualTo("userId", "RXOGvhBjTQNTASu4oLCQqVPRTtj1")
                .get()
                .addOnSuccessListener(queryDocumentSnapshots -> {
                    List<Tag> tagList = new ArrayList<>();
                    for (QueryDocumentSnapshot doc : queryDocumentSnapshots) {
                        String id = doc.getId();
                        String name = doc.getString("name");
                        String userId = doc.getString("userId");
                        tagList.add(new Tag(id, name, userId));
                    }
                    tagAdapter = new TagAdapter(tagList, this);
                    tagRecyclerView.setAdapter(tagAdapter);
                })
                .addOnFailureListener(e -> {
                    Log.e("Firestore", "Failed to load tags", e);
                    Toast.makeText(this, "Failed to load tags", Toast.LENGTH_SHORT).show();
                });

        btnCancel.setOnClickListener(v -> {
            dialog.dismiss();
            finish();
        });

        btnSubmit.setOnClickListener(v -> {
            List<String> selectedTags = tagAdapter.getSelectedTagIds();

            Map<String, Object> sharedItem = new HashMap<>();
            sharedItem.put("createdAt", new Date().toString());
            sharedItem.put("userId", "RXOGvhBjTQNTASu4oLCQqVPRTtj1");
            sharedItem.put("tags", selectedTags);

            if (Intent.ACTION_SEND.equals(action) && type != null) {
                if (type.equals("text/plain")) {
                    String sharedText = incomingIntent.getStringExtra(Intent.EXTRA_TEXT);
                    if (sharedText != null) {
                        sharedItem.put("content", sharedText);
                        sharedItem.put("contentType", "text");
                    }
                } else {
                    Uri fileUri = incomingIntent.getParcelableExtra(Intent.EXTRA_STREAM);
                    if (fileUri != null) {
                        sharedItem.put("url", fileUri.toString());
                        sharedItem.put("contentType", detectFileType(fileUri));
                    }
                }
            } else if (Intent.ACTION_SEND_MULTIPLE.equals(action)) {
                ArrayList<Uri> fileUris = incomingIntent.getParcelableArrayListExtra(Intent.EXTRA_STREAM);
                if (fileUris != null && !fileUris.isEmpty()) {
                    sharedItem.put("url", fileUris.get(0).toString());
                    sharedItem.put("contentType", detectFileType(fileUris.get(0)));
                }
            }

            FirebaseFirestore.getInstance()
                    .collection("sharedItems")
                    .add(sharedItem)
                    .addOnSuccessListener(documentReference -> {
                        Toast.makeText(this, "Shared item saved!", Toast.LENGTH_SHORT).show();
                        dialog.dismiss();
                        finish();
                    })
                    .addOnFailureListener(e -> {
                        Toast.makeText(this, "Failed to save item", Toast.LENGTH_SHORT).show();
                        Log.e("Firestore", "Error saving shared item", e);
                    });
        });

        dialog.setOnDismissListener(dialogInterface -> finish());
        dialog.show();
    }

    private String detectFileType(Uri uri) {
        String path = uri.toString().toLowerCase();
        if (path.endsWith(".jpg") || path.endsWith(".jpeg") || path.endsWith(".png")) return "image";
        if (path.endsWith(".mp4") || path.endsWith(".mov")) return "video";
        if (path.endsWith(".pdf")) return "pdf";
        return "url";
    }
} 

package io.sharely.app;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.text.InputType;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.google.android.material.bottomsheet.BottomSheetDialog;
import com.google.firebase.FirebaseApp;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;

import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

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
    private FirebaseFirestore db;
    private final String userId = "RXOGvhBjTQNTASu4oLCQqVPRTtj1";
    private String newlyAddedTagId = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        FirebaseApp.initializeApp(this);
        db = FirebaseFirestore.getInstance();
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

        tagAdapter = new TagAdapter(new ArrayList<>(), this, this::showAddNewTagDialog);
        tagRecyclerView.setAdapter(tagAdapter);

        fetchTags();

        btnCancel.setOnClickListener(v -> {
            dialog.dismiss();
            finish();
        });

        btnSubmit.setOnClickListener(v -> {
            List<String> selectedTags = tagAdapter.getSelectedTagIds();

            Map<String, Object> sharedItem = new HashMap<>();
            sharedItem.put("createdAt", new Date().toString());
            sharedItem.put("userId", userId);
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

            db.collection("sharedItems")
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

    private void fetchTags() {
        db.collection("tags")
                .whereEqualTo("userId", userId)
                .orderBy("createdAt", com.google.firebase.firestore.Query.Direction.DESCENDING)
                .get()
                .addOnSuccessListener(queryDocumentSnapshots -> {
                    List<Tag> tagList = new ArrayList<>();
                    tagList.add(new Tag("add_new", "Add New", userId));
                    for (QueryDocumentSnapshot doc : queryDocumentSnapshots) {
                        tagList.add(new Tag(doc.getId(), doc.getString("name"), doc.getString("userId")));
                    }
                    tagAdapter.setTags(tagList);
                    if (newlyAddedTagId != null) {
                        tagAdapter.selectTagById(newlyAddedTagId);
                        newlyAddedTagId = null;
                    }
                })
                .addOnFailureListener(e -> {
                    Log.e("Firestore", "Failed to load tags", e);
                    Toast.makeText(this, "Failed to load tags", Toast.LENGTH_SHORT).show();
                });
    }

    private void showAddNewTagDialog() {
        EditText input = new EditText(this);
        input.setInputType(InputType.TYPE_CLASS_TEXT);

        new AlertDialog.Builder(this)
                .setTitle("Add New Tag")
                .setView(input)
                .setPositiveButton("Add", (dialog, which) -> {
                    String tagName = input.getText().toString().trim();
                    if (!tagName.isEmpty()) {
                        Map<String, Object> newTag = new HashMap<>();
                        newTag.put("name", tagName);
                        newTag.put("userId", userId);
                        newTag.put("createdAt", new Date().toString());

                        db.collection("tags")
                                .add(newTag)
                                .addOnSuccessListener(docRef -> {
                                    newlyAddedTagId = docRef.getId();
                                    fetchTags();
                                })
                                .addOnFailureListener(e -> Toast.makeText(this, "Failed to add tag", Toast.LENGTH_SHORT).show());
                    }
                })
                .setNegativeButton("Cancel", null)
                .show();
    }

    private String detectFileType(Uri uri) {
        String path = uri.toString().toLowerCase();
        if (path.endsWith(".jpg") || path.endsWith(".jpeg") || path.endsWith(".png")) return "image";
        if (path.endsWith(".mp4") || path.endsWith(".mov")) return "video";
        if (path.endsWith(".pdf")) return "pdf";
        return "url";
    }
}

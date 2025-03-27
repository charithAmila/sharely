package io.sharely.app;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup; 
import android.widget.TextView;
import android.widget.Button;

import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.bottomsheet.BottomSheetDialog;

import java.util.ArrayList;
import java.util.List;

public class ShareReceiverActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        showBottomSheetWithSharedContent(getIntent());
    }

    private void showBottomSheetWithSharedContent(Intent intent) {
        String action = intent.getAction();
        String type = intent.getType();

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

        // TextView contentView = bottomSheetView.findViewById(R.id.shared_content_text);
        Button btnCancel = bottomSheetView.findViewById(R.id.btn_cancel);
        Button btnSubmit = bottomSheetView.findViewById(R.id.btn_submit);

        RecyclerView tagRecyclerView = bottomSheetView.findViewById(R.id.tag_grid);
        tagRecyclerView.setLayoutManager(new GridLayoutManager(this, 3)); // 3 columns
        TagAdapter tagAdapter = new TagAdapter(getSampleTags(), this);
        tagRecyclerView.setAdapter(tagAdapter);

        String displayText = "Unknown content";

        if (Intent.ACTION_SEND.equals(action) && type != null) {
            if (type.equals("text/plain")) {
                String sharedText = intent.getStringExtra(Intent.EXTRA_TEXT);
                if (sharedText != null) {
                    displayText = sharedText;
                }
            } else {
                Uri fileUri = intent.getParcelableExtra(Intent.EXTRA_STREAM);
                if (fileUri != null) {
                    displayText = "Shared file: " + fileUri.toString();
                }
            }
        } else if (Intent.ACTION_SEND_MULTIPLE.equals(action)) {
            ArrayList<Uri> fileUris = intent.getParcelableArrayListExtra(Intent.EXTRA_STREAM);
            if (fileUris != null && !fileUris.isEmpty()) {
                StringBuilder builder = new StringBuilder("Multiple files:\n");
                for (Uri uri : fileUris) {
                    builder.append(uri.toString()).append("\n");
                }
                displayText = builder.toString();
            }
        }

        // contentView.setText(displayText);

        btnCancel.setOnClickListener(v -> {
            dialog.dismiss();
            finish();
        });

        btnSubmit.setOnClickListener(v -> {
            // TODO: Send to Firebase, save, or pass to JS layer
            dialog.dismiss();
            finish();
        });

        dialog.setOnDismissListener(dialogInterface -> finish());
        dialog.show();
    }

    private List<Tag> getSampleTags() {
        List<Tag> tags = new ArrayList<>();
        tags.add(new Tag("1", "Add New", "user1"));
        tags.add(new Tag("2", "Live", "user1"));
        tags.add(new Tag("3", "English", "user1"));
        tags.add(new Tag("4", "Wiki", "user1"));
        tags.add(new Tag("5", "Twitter", "user1"));
        tags.add(new Tag("6", "Podcast", "user1"));
        tags.add(new Tag("7", "X", "user1"));
        tags.add(new Tag("8", "Funny", "user1"));
        tags.add(new Tag("9", "News", "user1"));
        tags.add(new Tag("10", "BBC", "user1"));
        tags.add(new Tag("11", "DB", "user1"));
        tags.add(new Tag("12", "YouTube", "user1"));
        tags.add(new Tag("13", "Facebook", "user1"));
        return tags;
    }
}

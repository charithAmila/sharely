package io.sharely.app;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.google.firebase.FirebaseApp;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;

import java.util.HashMap;
import java.util.Map;

public class ShareHandlerActivity extends AppCompatActivity {

    private Uri sharedUri;
    private String sharedText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        FirebaseApp.initializeApp(this);

        Intent intent = getIntent();

        ShareHandlerBottomSheet bottomSheet = ShareHandlerBottomSheet.newInstance(intent);
        bottomSheet.show(getSupportFragmentManager(), "ShareHandlerBottomSheet");

        finish(); // Close the lightweight activity
    }
}

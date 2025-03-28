package io.sharely.app;

import android.content.Context;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class TagAdapter extends RecyclerView.Adapter<TagAdapter.TagViewHolder> {
    private List<Tag> tagList;
    private final Context context;
    private final Set<String> selectedTagIds = new HashSet<>();
    private final Runnable onAddNewClicked;

    public TagAdapter(List<Tag> tagList, Context context, Runnable onAddNewClicked) {
        this.tagList = tagList;
        this.context = context;
        this.onAddNewClicked = onAddNewClicked;
    }

    public void setTags(List<Tag> tagList) {
        this.tagList = tagList;
        notifyDataSetChanged();
    }

    public List<String> getSelectedTagIds() {
        return new ArrayList<>(selectedTagIds);
    }

    public void selectTagById(String tagId) {
        selectedTagIds.add(tagId);
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public TagViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.tag_item, parent, false);
        return new TagViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull TagViewHolder holder, int position) {
        Tag tag = tagList.get(position);

        if ("add_new".equals(tag.getId())) {
            holder.tagLetter.setText("+");
            holder.tagLetter.setTextSize(24);
            holder.cardView.setCardBackgroundColor(Color.parseColor("#007BFF"));
            holder.tagName.setText("Add New");
            holder.tagName.setTextColor(Color.BLACK);
            holder.cardView.setOnClickListener(v -> onAddNewClicked.run());
            return;
        }

        holder.tagLetter.setText(tag.getName().substring(0, 1).toUpperCase());
        holder.tagName.setText(tag.getName());

        boolean isSelected = selectedTagIds.contains(tag.getId());
        int bgColor = isSelected ? Color.parseColor("#007BFF") : Color.DKGRAY;
        holder.cardView.setCardBackgroundColor(bgColor);
        holder.tagLetter.setTextColor(Color.WHITE);
        holder.tagName.setTextColor(Color.BLACK);

        holder.cardView.setOnClickListener(v -> {
            if (selectedTagIds.contains(tag.getId())) {
                selectedTagIds.remove(tag.getId());
            } else {
                selectedTagIds.add(tag.getId());
            }
            notifyItemChanged(position);
        });
    }

    @Override
    public int getItemCount() {
        return tagList.size();
    }

    static class TagViewHolder extends RecyclerView.ViewHolder {
        TextView tagLetter, tagName;
        CardView cardView;

        public TagViewHolder(@NonNull View itemView) {
            super(itemView);
            tagLetter = itemView.findViewById(R.id.tag_letter);
            tagName = itemView.findViewById(R.id.tag_name);
            cardView = itemView.findViewById(R.id.tag_card);
        }
    }
}

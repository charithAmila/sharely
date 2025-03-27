package io.sharely.app;

import android.content.Context;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class TagAdapter extends RecyclerView.Adapter<TagAdapter.TagViewHolder> {
    private List<Tag> tagList;
    private Context context;

    public TagAdapter(List<Tag> tagList, Context context) {
        this.tagList = tagList;
        this.context = context;
    }

    public static class TagViewHolder extends RecyclerView.ViewHolder {
        public TextView tagLetter;
        public TextView tagName;
        public CardView tagCard;

        public TagViewHolder(View v) {
            super(v);
            tagCard = v.findViewById(R.id.tag_card);
            tagLetter = v.findViewById(R.id.tag_letter);
            tagName = v.findViewById(R.id.tag_name);
        }
    }

    @Override
    public TagViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.tag_item, parent, false);
        return new TagViewHolder(v);
    }

    @Override
    public void onBindViewHolder(TagViewHolder holder, int position) {
        Tag tag = tagList.get(position);
        holder.tagLetter.setText(tag.name.substring(0, 1).toUpperCase());
        holder.tagName.setText(tag.name);
    }

    @Override
    public int getItemCount() {
        return tagList.size();
    }
}

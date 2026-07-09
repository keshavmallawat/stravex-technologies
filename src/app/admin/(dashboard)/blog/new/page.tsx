import { ContentPostForm } from "@/components/admin/content/content-post-form";
import { createBlogPostAction, updateBlogPostAction } from "@/app/admin/(dashboard)/blog/actions";

export const metadata = {
  title: "New Blog Post | Stravex CMS",
};

export default function NewBlogPostPage() {
  return (
    <div>
      <span className="font-mono-label text-[10px] uppercase text-ink/40">
        [ Blog / New ]
      </span>
      <h2 className="mt-2 text-2xl font-semibold text-ink">New Blog Post</h2>

      <div className="mt-6">
        <ContentPostForm
          kind="blog"
          createAction={createBlogPostAction}
          updateAction={updateBlogPostAction}
        />
      </div>
    </div>
  );
}

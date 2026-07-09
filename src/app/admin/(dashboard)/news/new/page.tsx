import { ContentPostForm } from "@/components/admin/content/content-post-form";
import { createNewsPostAction, updateNewsPostAction } from "@/app/admin/(dashboard)/news/actions";

export const metadata = {
  title: "New News Item | Stravex CMS",
};

export default function NewNewsPostPage() {
  return (
    <div>
      <span className="font-mono-label text-[10px] uppercase text-ink/40">
        [ News / New ]
      </span>
      <h2 className="mt-2 text-2xl font-semibold text-ink">New News Item</h2>

      <div className="mt-6">
        <ContentPostForm
          kind="news"
          createAction={createNewsPostAction}
          updateAction={updateNewsPostAction}
        />
      </div>
    </div>
  );
}

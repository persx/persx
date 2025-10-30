import ContentEditor from "../components/ContentEditor";

type SearchParams = {
  type?: string;
};

export default function NewContentPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Content</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Add new content to your knowledge base
        </p>
      </div>

      <ContentEditor defaultType={searchParams.type} />
    </div>
  );
}

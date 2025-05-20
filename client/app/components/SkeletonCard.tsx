import { Skeleton } from "~/components/ui/skeleton"; // Припускаємо, що цей Skeleton - це базовий блок для створення скелетонів

export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full gap-4">
      {/* Placeholder for image */}
      <Skeleton className="h-[125px] w-[250px] rounded-xl bg-gray-200" />

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow mb-4">
          {/* Placeholder for title */}
          <Skeleton className="h-6 w-3/4 mb-2 rounded bg-gray-200" />
          {/* Placeholder for description (можна зробити кілька рядків) */}
        </div>

        <div>
          {/* Placeholder for price */}
          <Skeleton className="h-8 w-1/3 mb-3 rounded bg-gray-200" />
          {/* Placeholder for button */}
          <Skeleton className="h-10 w-full rounded-lg bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

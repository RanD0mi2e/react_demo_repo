import { useState } from "react";
import { FlatObject } from "./place";

export default function PlaceTree({
  id,
  placesById,
  parentId,
  onComplete,
}: {
  id: number;
  placesById: FlatObject;
  parentId: number;
  onComplete: any;
}) {
  const place = placesById[id];
  const childIds = place.children;

  const handleComplete = () => {
    console.log('handleComplete', parentId, 'sub', id);
    onComplete(parentId, id)
  }

  return (
    <li>
      {place.title}
      <button onClick={handleComplete}>Complete</button>
      {childIds.length > 0 && (
        <ol>
          {childIds.map((childId) => (
            <PlaceTree
              key={childId}
              id={childId}
              placesById={placesById}
              parentId={id}
              onComplete={onComplete}
            />
          ))}
        </ol>
      )}
    </li>
  );
}

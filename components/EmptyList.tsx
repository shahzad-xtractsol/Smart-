import React from 'react';

type Props = {
  image?: string;
  title?: string;
  message?: string;
};

export default function EmptyList({
  image = '/assets/images/no-data-found.png',
  title = 'No Data',
  message = 'No data found',
}: Props) {
  return (
    <div className="text-center py-6">
      <img src={image} alt={title} className="w-40 h-auto opacity-90 mb-4 mx-auto" />
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {message && <p className="text-sm text-gray-500 mt-1">{message}</p>}
    </div>
  );
}

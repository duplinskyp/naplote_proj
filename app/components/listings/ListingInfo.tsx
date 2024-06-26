import React from 'react';
import dynamic from 'next/dynamic';
import { SafeUser } from '@/app/types';
import Avatar from '../Avatar';
import ListingCategory from './ListingCategory';

const Map = dynamic(() => import('../Map'), { ssr: false });

interface ListingInfoProps {
  user: SafeUser;
  description: string;
  category: {
    icon: any;
    label: string;
    description: string;
  } | null;
  coordinates: number[];
  locationValue: string;
  dimensionsX :number;
  dimensionsY :number;
  politics : boolean;
  adultContent : boolean;

}

const ListingInfo: React.FC<ListingInfoProps> = ({
  user,
  description,
  category,
  coordinates,
  locationValue,
  dimensionsX,
  dimensionsY,
  politics,

}) => {
  // Debugging coordinates
  console.log('ListingInfo coordinates:', coordinates);

  return (
    <div className="col-span-4 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="text-xl font-semibold flex flex-row items-center gap-2">
          <div>Hosted by {user?.name}</div>
          <Avatar src={user?.image} />
        </div>
        <div className="flex flex-row items-center gap-4 font-light text-neutral-500">
          
        </div>
      </div>
      <hr />
      {category && (
        <ListingCategory
          icon={category.icon}
          label={category.label}
          description={category.description}
        />
      )}
      <hr />
      <div className="text-lg font-light text-neutral-500">
        {description}
      </div>
      <hr />
      <Map center={coordinates} />
    </div>
  );
};

export default ListingInfo;

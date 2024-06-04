'use client';

import { usePathname, useSearchParams } from 'next/navigation';

import { BsFillBuildingsFill } from "react-icons/bs";
import { FaCarAlt, FaPlane } from "react-icons/fa";
import { 
  GiSpikedFence, 
 
} from 'react-icons/gi';
import { MdSmartScreen } from "react-icons/md";
import { FaSkiing } from 'react-icons/fa';
import { BsSnow } from 'react-icons/bs';
import { IoDiamond } from 'react-icons/io5';
import { MdOutlineVilla } from 'react-icons/md';

import CategoryBox from "../CategoryBox";
import Container from '../Container';
import DimensionInput from '../inputs/DimensionsInput';


export const categories = [
  {
    label: 'Plot',
    icon: GiSpikedFence,
    description: 'Reklamná plocha na vašom plote!',
  },
  {
    label: 'Billboard',
    icon: MdSmartScreen,
    description: 'Máťe Billboard? Skvelé, zaregistrujte si ho.',
  },
  {
    label: 'Budova',
    icon: BsFillBuildingsFill,
    description: 'Prázdna stena na strane budovy? Ideal pre veľko rozmerové reklamy.'
  },
  {
    label: 'Vozidlo',
    icon: FaCarAlt,
    description: 'Premeňte svoje vozidlo na zarabajúcu cestujúcu reklamu!'
  },
  {
    label: 'Iné',
    icon: FaPlane,
    description: 'Viete vystaviť reklamu na špecialnej ploche na ktorú nemáme kategóriu? Kliknite Tu!'
  },
  
]

const Categories = () => {
  const params = useSearchParams();
  const category = params?.get('category');
  const pathname = usePathname();
  const isMainPage = pathname === '/';

  if (!isMainPage) {
    return null;
  }

  return (
    <Container>
      <div
        className="
          pt-4
          flex 
          flex-row 
          items-center 
          justify-between
          overflow-x-auto
        "
      >
        {categories.map((item) => (
          <CategoryBox 
            key={item.label}
            label={item.label}
            icon={item.icon}
            selected={category === item.label}
          />
        ))}
 {/* Adding dimension inputs visually aligned with categories */}
       

      </div>
    </Container>
  );
}
 
export default Categories;
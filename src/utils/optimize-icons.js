/**
 * Icon Optimization Helper
 * 
 * This module provides optimized ways to import and use icons from large libraries
 * like @mui/icons-material and react-icons to minimize "deoptimised styling" warnings.
 */
import dynamic from 'next/dynamic';

// Generic dynamic icon importer for MUI icons
export const dynamicMuiIcon = (iconName) => {
  return dynamic(() => import('@mui/icons-material').then((icons) => icons[iconName]));
};

// Generic dynamic icon importer for React Icons
export const dynamicReactIcon = (iconPack, iconName) => {
  return dynamic(() => 
    import(`react-icons/${iconPack.toLowerCase()}`).then((pack) => pack[iconName])
  );
};

// Example usage:
// const StarIcon = dynamicMuiIcon('Star');
// const FaHome = dynamicReactIcon('fa', 'FaHome');

export const brandAssets = {
  logoMark: '/brand/keymiay-main-logo.svg',
  logoType: '/brand/keymiay-logo-type.svg',
  maleProfile: '/brand/male-profile.svg',
  femaleProfile: '/brand/female-profile.svg',
};

export const defaultProfileAvatar = brandAssets.maleProfile;

export const profileAvatarOptions = [
  { id: 'male', label: 'پروفایل مرد', src: brandAssets.maleProfile },
  { id: 'female', label: 'پروفایل زن', src: brandAssets.femaleProfile },
];

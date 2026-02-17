import { NavigateFunction } from 'react-router-dom';

export interface UserProfileData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  salesmanId?: string;
  avatar?: string;
}

/**
 * Navigate to profile edit page with user data
 * @param navigate - React Router navigate function
 * @param userData - User data to edit
 * @param returnPath - Path to return after edit (optional)
 */
export const navigateToProfileEdit = (
  navigate: NavigateFunction,
  userData: UserProfileData,
  returnPath?: string
) => {
  const editPath = `/admin/salesman/${userData.id}/edit`;

  navigate(editPath, {
    state: {
      userData,
      returnPath: returnPath || `/admin/salesman/${userData.id}`,
    },
  });
};

/**
 * Navigate to own profile edit (for admin or salesman)
 * @param navigate - React Router navigate function
 * @param userRole - User role ('admin' | 'salesman')
 */
export const navigateToOwnProfileEdit = (
  navigate: NavigateFunction,
  userRole: 'admin' | 'salesman'
) => {
  const path = userRole === 'admin' ? '/admin/profile/edit' : '/salesman/profile/edit';
  navigate(path);
};

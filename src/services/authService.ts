
import UserRole from '../enums/userRoles';

const checkIfOwnerUserOrAdmin = async(
  ownerUserId?: string, authUserId?: string  , authUserRole?: UserRole,
): Promise<boolean> => {
  const result =  ownerUserId !== authUserId || authUserRole !== 'admin' ;
  return result ;
};

export { checkIfOwnerUserOrAdmin };

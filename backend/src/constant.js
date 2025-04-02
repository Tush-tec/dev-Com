
/**
 * @type {{ ADMIN: "ADMIN"; USER: "USER"} as const}
 */
export const UserRolesEnum = {
    ADMIN: "ADMIN",
    USER: "USER",
  };
  
  export const AvailableUserRoles = Object.values(UserRolesEnum);
  
  /**
   * @type {{ PENDING: "PENDING"; CANCELLED: "CANCELLED"; DELIVERED: "DELIVERED" } as const}
   */
  export const OrderStatusEnum = {
    PENDING: "PENDING",
    CANCELLED: "CANCELLED",
    DELIVERED: "DELIVERED",
  };
  
  export const AvailableOrderStatuses = Object.values(OrderStatusEnum);

  export const PaymentProviderEnum = {
    UNKNOWN: "UNKNOWN",
    RAZORPAY: "RAZORPAY",
    PAYPAL: "PAYPAL",
  };
  
  export const AvailablePaymentProviders = Object.values(PaymentProviderEnum);
  
  
  /**
   * @type {{ GOOGLE: "GOOGLE"; GITHUB: "GITHUB"; EMAIL_PASSWORD: "EMAIL_PASSWORD"} as const}
   */
  export const UserLoginType = {
    GOOGLE: "GOOGLE",
    GITHUB: "GITHUB",
    EMAIL_PASSWORD: "EMAIL_PASSWORD",
  };
  
  export const AvailableSocialLogins = Object.values(UserLoginType);


  
 
  
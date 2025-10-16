declare global {
    type SignInFormData = {
        email: string;
        password: string;
    };
    type SignUpFormData = {
        username: string;
        email: string;
        password: string;
        confirmPassword: string;
    }
    type CheckoutFormData = {
        receiverName: string;
        receiverAddress: string;
        receiverPhone: string;
        orderNotes?: string; 
        paymentMethod: 'COD' | 'BANK';
    }

    type FormInputProps = {
        name: string;
        label: string;
        placeholder: string;
        type?: string;
        register: UseFormRegister<SignUpFormData>;
        error?: FieldError;
        validation?: RegisterOptions;
        disabled?: boolean;
        value?: string;
    }   
    type FormCheckoutInputProps = {
        name: keyof CheckoutFormData;
        label: string;
        placeholder: string;
        type?: string;
        register: UseFormRegister<CheckoutFormData>;
        error?: FieldError;
        validation?: RegisterOptions;
        disabled?: boolean;
        value?: string;
    }   
    type FooterLinkProps = {
        text: string;
        linkText: string;
        href: string;
    };
}
export {};
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
    type FormInputProps = {
        name: string;
        label: string;
        placeholder: string;
        type?: string;
        register: UseFormRegister;
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
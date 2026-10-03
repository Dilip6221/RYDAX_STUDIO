import { toast } from "react-hot-toast";

export const validateForm = ({
    values,
    validationRules,
    inputRefs
}) => {
    for (let key of Object.keys(validationRules)) {
        const rules = validationRules[key];
        const value = values[key];
        if (rules.required) {
            const isEmpty = Array.isArray(value) ? value.length === 0 : !value?.toString().trim();
            if (isEmpty) {
                toast.error(rules.message || `${key} is required`);
                inputRefs[key]?.current?.focus?.();
                inputRefs[key]?.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
                return false;
            }
        }
        if (
            rules.minLength &&
            value.length < rules.minLength
        ) {
            toast.error(rules.minLengthMessage ||`${key} must be at least ${rules.minLength} characters`);
            inputRefs[key]?.current?.focus?.();
            inputRefs[key]?.current?.scrollIntoView({behavior: "smooth",block: "center"});
            return false;
        }
        if (rules.pattern && !rules.pattern.test(value)) {
            toast.error(rules.patternMessage || `Invalid ${key}`);
            inputRefs[key]?.current?.focus?.();
            inputRefs[key]?.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            return false;
        }
    }
    return true;
};
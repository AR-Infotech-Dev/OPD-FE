import { useAppSelector, useModuleFilters } from "@store/hooks";
export const useRedirectFilter = () => {
    const { setSearchText, applyFilterPayload } = useModuleFilters();

    const applyTicketRedirectFilter = (label = '') => {
        switch (label) {
            default:
                break;
        }
    }
    return {
        applyTicketRedirectFilter
    };
};

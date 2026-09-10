import Swal from "sweetalert2";

export const confirmDelete = async ({ count = 1, itemLabel = "record", title } = {}) => {
  const isBulkDelete = Number(count) > 1;
  const result = await Swal.fire({
    title: title || (isBulkDelete ? `Delete ${count} records?` : `Delete this ${itemLabel}?`),
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#64748b",
    focusCancel: true,
    reverseButtons: true,
  });

  return result.isConfirmed;
};

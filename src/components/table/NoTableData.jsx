import { Database, SearchX } from "lucide-react";

function NoTableData({ colSpan = 1 }) {
  return (
    <tr className="w-full" style={{ width: '100%' }} >
      <td colSpan={colSpan} className="table-empty-cell">
        <div className="table-empty-state">
          <div className="table-empty-copy">
            <img src={import.meta.env.BASE_URL + "svg/no_data.svg"} alt="" />
            <h3>No Data Found</h3>
            <p>No records match the current view. Try adjusting filters, search, or visible columns.</p>
          </div>
        </div>
      </td>
    </tr>
  );
}

export default NoTableData;

import {
  Search,
  NotificationsNone,
  Settings,
  AccountCircle,
} from "@mui/icons-material";
import { CustomInput } from "./CustomComponents";
import { useState } from "react";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const activeTab = useSelector((state) => state.utility.activeTab);
  return (
    <div
      className="w-100 justify-content-between align-items-center d-flex px-4 border-bottom"
      style={{ height: 85 }}
    >
      <label htmlFor="" className="fw-bold fs-4 text-primary ms-3">
        {activeTab}
      </label>
      <div className="justify-content-end align-items-center d-flex px-2 gap-4">
        {/* <CustomInput
          placeholder={"Search"}
          value={search}
          onInput={setSearch}
          style={{ width: 300 }}
          leftIcon={<Search />}
        /> */}

        <NotificationsNone
          className="text-primary"
          style={{
            width: 30,
            height: 30,
            marginBottom: 10,
          }}
        />
      </div>
    </div>
  );
};

export default Navbar;

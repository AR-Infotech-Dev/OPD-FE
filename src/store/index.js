import { configureStore } from "@reduxjs/toolkit";
import moduleFiltersReducer from "./moduleFiltersSlice";
import usersReducer from "@modules/users/data/users.slice"
import categoriesReducer from "@modules/category/data/categories.slice";
import companyMasterReducer from "@modules/company-master/data/companyMaster.slice";
import menuMasterReducer from "@modules/menu-master/data/menuMaster.slice";
import userroleReducer from "@modules/user-role/data/userrole.slice";

import patientsReducer from "@modules/patients/data/patients.slice"
import doctorsReducer from "@modules/doctors/data/doctors.slice"


import labReducer from "@modules/lab/data/lab.slice";
import departmentsReducer from "@modules/departments/data/departments.slice";
import appointmentReducer from "@modules/appointment/data/appointment.slice";
export const store = configureStore({
  reducer: {
    moduleFilters: moduleFiltersReducer,
    users: usersReducer,
    categories: categoriesReducer,
    companyMaster: companyMasterReducer,
    menuMaster: menuMasterReducer,
    userrole: userroleReducer,

    patients: patientsReducer,
    doctors: doctorsReducer,
    lab: labReducer,
    departments:departmentsReducer,
    appointment: appointmentReducer,
  },
});

export default store;

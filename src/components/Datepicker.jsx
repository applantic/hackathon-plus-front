import React from "react";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import { SingleDatePicker } from "react-dates";

export default ({ ...props }) => <SingleDatePicker {...props} />;

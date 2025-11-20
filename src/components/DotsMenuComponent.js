import React from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownMenu from "./DropdownMenuComponent";

export default function DotsMenuComponent({ dots, dropdown }) {
    return (
        <Dropdown bsPrefix="mc-dropdown">
            <Dropdown.Toggle bsPrefix="mc-dropdown-toggle"><i className={ dots } /></Dropdown.Toggle>
            <DropdownMenu className="mc-dropdown-paper" dropdown={ dropdown } />
        </Dropdown>
    )
}
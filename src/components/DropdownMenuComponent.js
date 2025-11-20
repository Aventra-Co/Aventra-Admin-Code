import React, { useContext } from "react";
import { TranslatorContext } from "../context/Translator"; 
import { AnchorComponent, ButtonComponent } from "./elements";
import Dropdown from 'react-bootstrap/Dropdown';

export default function DropdownMenuComponent({ dropdown }) {
    const { t } = useContext(TranslatorContext)
    return (
        <Dropdown.Menu align="end" className="mc-dropdown-paper">
            {dropdown.map((item, index) => (
                item.path ?
                <AnchorComponent
                    key={index}
                    href={item.path}
                    icon={item.icon}
                    text={t(item.text)}
                    onClick={item.onClick}
                    className="mc-dropdown-menu"
                />
                :
                <ButtonComponent
                    key={index}
                    icon={item.icon}
                    text={t(item.text)}
                    onClick={item.onClick}
                    className="mc-dropdown-menu"
                />
            ))}
        </Dropdown.Menu>
    )
}
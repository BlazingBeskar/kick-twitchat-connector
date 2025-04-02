import { jsx as _jsx } from "react/jsx-runtime";
export const Card = (props) => _jsx("div", { ...props, className: 'bg-gray-800 p-4 rounded-xl shadow', children: props.children });
export const CardContent = (props) => _jsx("div", { ...props, className: 'mt-2', children: props.children });

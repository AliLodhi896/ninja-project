import React from "react";

interface AlertProps {
	variant: AlertType;
	show: boolean;
	dismissable?: boolean;
	onClose?: () => void;
	children: React.ReactChild | React.ReactChild[];
}

export interface IAlertConfig {
	showAlert: boolean;
	alertType: AlertType;
	alertMessage: string;
}

export type AlertType = "success" | "info" | "caution" | "warning" | "danger";

const DEFAULT_ALERT_VARIANT = "danger";

export const Alert = (props: AlertProps) => {
	const alertClassName = `alert-${props.variant || DEFAULT_ALERT_VARIANT}`;
	const dismissElement = props.dismissable ? (
		<button type="button" className="close" aria-label="Close">
			<span
				aria-hidden="true"
				onClick={props.onClose}
				className="cursor-pointer"
			>
				&times;
			</span>
		</button>
	) : (
		""
	);
	return (
		<div
			className={`alert fade ${props.show ? "show" : ""}
                ${props.dismissable ? "alert-dismissible" : ""}
                ${alertClassName}
            `}
			role="alert"
            >
			{props.children}
			{dismissElement}
		</div>
	);
};
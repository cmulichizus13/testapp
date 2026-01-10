interface buttonProps {
    onClick(): void;
}

function Button(props : buttonProps){
    const onClick = props.onClick

    return  (
        <button type="button" onClick={onClick}>
            <span>クリック</span>
        </button>
    )
}

export default Button
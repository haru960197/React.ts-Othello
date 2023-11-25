export type SquareState = '○' | '●' | null;

type SquareProps = {
    value: SquareState;
    onClick: () => void;
}

export default function Square(props: SquareProps) {
    const color = props.value === '○' ? "white" : "black"
    return (
        <button className={color + "-square"} onClick={props.onClick}>
            {props.value !== null ? '●' : null}
        </button>
    );
}
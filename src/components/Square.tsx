export type SquareState = '〇' | '●' | null;

type SquareProps = {
    value: SquareState;
    onClick: () => void;
}

export default function Square(props: SquareProps) {
    return (
        <button onClick={props.onClick}>
            {props.value}
        </button>
    );
}
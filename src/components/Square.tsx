export type SquareState = '○' | '●' | null;

type SquareProps = {
    value: SquareState;
    onClick: () => void;
}

export default function Square(props: SquareProps) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}
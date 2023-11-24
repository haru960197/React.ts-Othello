import { SquareState } from './Square';
import Board, { BoardState } from './Board';
import { useState } from 'react';

type Step = {
    squares: SquareState[];
    blackIsNext: boolean;
}

type GameState = {
    curStep: Step;
    prevStep: Step;
}

export default function Game() {
    
}
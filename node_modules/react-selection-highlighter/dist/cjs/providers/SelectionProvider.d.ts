import React from 'react';
import { Dispatch, SetStateAction } from 'react';
import { SelectionType } from '../types';
export declare const SelectionsContext: React.Context<{
    selections: SelectionType[];
    setSelections: Dispatch<SetStateAction<SelectionType[]>>;
} | null>;
type SelectionProviderType = {
    children: React.ReactNode;
};
export declare const SelectionProvider: ({ children }: SelectionProviderType) => import("react/jsx-runtime").JSX.Element;
export {};

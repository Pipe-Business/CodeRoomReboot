import styled from "@emotion/styled"

interface BuilderMenuContainerProps {
    width?: string;
    height?: string;
}

export const BuilderMenuListItemButtonContainer = styled.button<BuilderMenuContainerProps>`
    display: flex;
    justify-content: center;
    align-items: start;
    flex-direction: column;
    width: ${props => props.width || '20%'};
    height: ${props => props.height || 'auto'};
    border: 1px solid grey;
    border-radius: 10px;
    padding: 12px;
    margin: 16px 16px 16px 0;
    background-color: white;
    &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
        border: 2px solid rgba(0, 0, 0, 0.2);
    },
`

export const SuggestionMenuContainer = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 80%;
    height: 124px;
    border: 1px solid grey;
    border-radius: 10px;
    padding: 12px;
    margin-top: 16px;
    background-color: white;
    font-size: 24px;
`

export const GoToCustomBtnContainer = styled.button`
    display: flex;
    justify-content: center;
    align-items: start;
    flex-direction: column;
    width: 90%;
    height: 124px;
    border: 1px solid grey;
    border-radius: 10px;
    padding: 24px;
    margin-right: 16px;
    background-color: white;
`

export const TitleContainer = styled.div`
    display: flex;
    justify-content: space-between;
    flex-direction: row;
`;

export const TitleSelectButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

export const TitleSelectAreaContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

export const RightEndContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
`;

export const BuilderMenuListItemContainer = styled.button<BuilderMenuContainerProps>`
    display: flex;
    justify-content: center;
    align-items: start;
    flex-direction: column;
    width: ${props => props.width || '20%'};
    height: ${props => props.height || 'auto'};
    border: 1px solid grey;
    border-radius: 10px;
    padding: 12px;
    margin: 16px 16px 16px 0;
    background-color: white;
`
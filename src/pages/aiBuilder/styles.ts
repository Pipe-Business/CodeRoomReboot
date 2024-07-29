import styled from "@emotion/styled"

interface BuilderMenuContainerProps {
    width?: string;
    height?: string
    image:string;
}

export const BuilderMenuListItemButtonContainer = styled.button<BuilderMenuContainerProps>`
    display: flex;
    background-image: url(${props => props.image});
    justify-content: end;
    align-items: start;
    background-repeat : no-repeat;
    background-size: cover;
    flex-direction: column;
    width: ${props => props.width || '32%'};
    height: ${props => props.height || 'auto'};
    border: none;
    border-radius: 10px;
    padding: 12px;
    margin: 16px 16px 16px 0;
    color: white;
    position: relative;
    
    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5); /* 투명도 조절 (0.6: 60% 투명도) */
        z-index: 1;
        border-radius: 10px;
    }
    
    &:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
    }

    > * {
        position: relative;
        z-index: 2; /* 자식 요소들이 투명 오버레이 위에 위치하도록 설정 */
    }
`

interface IdeaListItemButtonProps {
    width?: string;
    height?: string
}

export const IdeaListItemButtonContainer = styled.button<IdeaListItemButtonProps>`
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

interface IdeaListItemButtonProps {

}

export const TitleSelectButtonContainer = styled.button`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: white;
    color:#B4B4B4;
    border: none;
`;

export const TitleSelectAreaContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

export const RightEndContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;
    position: fixed;
    color:white;
    background-color: black;
    font-weight: bold;
    right: 104px;
    bottom: 48px;
    padding: 16px 32px 16px;
    border-radius: 4px;
    font-size: 24px;
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

export const CenterBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const CardHeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin: 16px 8px 16px;
`

export const RestartButtonContainer = styled.button`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px;
    margin-right: 256px;
`

export const AibuilderContentContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: start;
    margin-bottom: 256px;
`

export const AibuilderContentImageContainer = styled.img`
    height: 600px;
    width:30%;
    position: fixed;
    top: 160px;
    right: 0;
    opacity: 0.4;
   `


export const CustomPromptContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin: 16px 8px 16px;
    align-items: center;
`

export const RefactoredContainer = styled.div`
    padding: 16px;
    border: 1px solid #B4B4B4;
    border-radius: 4px;
`
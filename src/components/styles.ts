import styled from "@emotion/styled"
//todo 컴포넌트 마다 분리 
export const CenterBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

interface MarginStyle {
    size:number
}
export const MarginHorizontal = styled.div<MarginStyle>`
  margin-left: ${(props) => props.size}px;
  margin-right: ${(props) => props.size}px;
`
export const MarginVertical = styled.div<MarginStyle>`
  margin-left: ${(props) => props.size};
  margin-right: ${(props) => props.size};
`
export const Margin = styled.div<MarginStyle>`
    margin: ${(props)=>props.size};
`

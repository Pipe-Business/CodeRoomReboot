import styled from "@emotion/styled"
import Button, { ButtonProps } from '@mui/material/Button';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import Slider from "react-slick";

export const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: '#ffffff',
    backgroundColor: 'primary',
    height : '64px',
  '&:hover': {
    backgroundColor: '#569CD6',
    boxShadow: 'none',
    },
  }));

  interface BlurContainerStyle{
    isBlur:boolean
  }

  export const BlurContainer = styled.div<BlurContainerStyle>`
    filter:  ${(props) => props.isBlur == true ? ' blur(5px)' : 'none'};
  `;

export const StyledSlider = styled(Slider)`
  height: 100%; //슬라이드 컨테이너 영역

    .slick-list {
      width: 50%;
      height: 50%;
      margin: 0;
      overflow-x: hidden;
    }

    .slick-slide div {
      /* cursor: pointer; */
    }
      .slick-dots {
        width: 50%;
        margin: 0;
      }
`;
  
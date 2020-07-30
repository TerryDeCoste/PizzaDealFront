import React, { useState, useRef, useEffect } from 'react';
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

import DealBox from '../../components/DealBox/DealBox';
import classes from './TopDeals.module.css';

export default (props) => {
    if (!props.deals){
        return null;
    }

    const deal_list = props.deals.map((deal, i) => (
        <div key={i} className="keen-slider__slide">
            <DealBox info={deal}></DealBox>
        </div>
    ));
    
    const [pause, setPause] = useState(false);
    const timer = useRef();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [sliderRef, slider] = useKeenSlider({
        slidesPerView: 2,
        mode: "free-snap",
        spacing: 15,
        centered: true,
        controls: true,
        loop: true,
        initial: 0,
        slideChanged(s) {
            setCurrentSlide(s.details().relativeSlide);
        },
        duration: 2000,
        dragStart: () => {
            setPause(true);
        },
        dragEnd: () => {
            setPause(false);
        },
    });
    useEffect(() => {
        sliderRef.current.addEventListener("mouseover", () => {
            setPause(true);
        });
        sliderRef.current.addEventListener("mouseout", () => {
            setPause(false);
        });
    }, [sliderRef]);

    useEffect(() => {
        timer.current = setInterval(() => {
            if (!pause && slider) {
                slider.next();
            }
        }, 4500);
        return () => {
            clearInterval(timer.current);
        };
    }, [pause, slider]);

    return (
        <div className={classes.TopBox}>
            <div className={classes.Title}>TOP DEALS IN YOUR AREA</div>
            <div className="navigation-wrapper">
                <div ref={sliderRef} className="keen-slider">
                    {deal_list}
                </div>
            </div>
            {slider && (
                <div className={classes.dots}>
                {[...Array(slider.details().size).keys()].map(idx => {
                    return (
                    <button
                        key={idx}
                        onClick={() => {
                        slider.moveToSlideRelative(idx);
                        }}
                        className={classes.dot + (currentSlide === idx ? " " + classes.dotactive : "")}
                    />
                    );
                })}
                </div>
            )}
        </div>
    ) 
}


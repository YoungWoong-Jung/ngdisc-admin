import { Dispatch, ReactNode, SetStateAction, useEffect } from "react";
import Portal from "../etc/Portal";
import { AnimatePresence, motion } from "framer-motion";

export default function Modal ({
    display,
    setDisplay,
    position = 'center',
    disableBackgroundToggle = false,
    background = 'bg-black bg-opacity-50',
    children
}: {
    display: boolean;
    setDisplay: Dispatch<SetStateAction<boolean>>;
    position?: 'center' | 'bottom' | 'top';
    disableBackgroundToggle?: boolean;
    background?: string;
    children?: ReactNode
}){

    const backgroundToggle = () => {
        disableBackgroundToggle ? false : setDisplay(false);
    }


    return (
        <Portal id='modal-root'>
                <AnimatePresence mode="wait">
                    {
                        display && <>
                            <div className="z-[999] fixed left-0 right-0 top-0 bottom-0 h-screen">
                                {/* content */}
                                {
                                    children &&
                                    position === 'center' ? <ModalCenter>{children}</ModalCenter>
                                    : position === 'bottom' ? <ModalBottom>{children}</ModalBottom>
                                    :<></>
                                    
                                }
                                {/* {background} */}
                                <motion.div
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    exit={{opacity: 0}}
                                    transition={{duration: 0.2}}
                                    onClick={backgroundToggle}
                                    className={` backdrop-blur-xl fixed z-[-1] w-screen h-screen left-0 top-0 ${background}`}
                                ></motion.div>
                            </div>
                        </>
                    }
                </AnimatePresence>
        </Portal>
    )
}

function ModalCenter({
    children
}: {
    children?: ReactNode
}){

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [])

    return <>
        <motion.div
            initial={{opacity: 0,translateY:0, translateX: '-50%' }}
            animate={{opacity: 1, translateY: '-50%' , translateX: '-50%'}}
            exit={{opacity: 0, translateY: 0 , translateX: '-50%'}}
            transition={{duration: 0.2}}
            className="top-[50vh] w-full left-1/2 fixed -translate-x-1/2  z-1"
        >
            {children}
        </motion.div>
    </>
}

function ModalBottom ({
    children
  }: {
    children?: ReactNode
  }) { 
  
    useEffect(()=>{
  
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'auto'
      }
    }, [])
  
    return <>
      <motion.div
        initial={{opacity: 0, translateY: 100, translateX: '-50%' }}
        animate={{opacity: 1, translateY: 0, translateX: '-50%' }}
        exit={{opacity: 0, translateY: 100, translateX: '-50%' }}
        transition={{duration: 0.2}}
        className="bottom-0 fixed w-full  z-1 left-1/2 -translate-x-1/2 max-w-screen-sm"
      >
        {children}
      </motion.div>
    </>
  }
  
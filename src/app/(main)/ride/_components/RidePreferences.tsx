import React from 'react'
import { RidePreferencesEnum } from "@/types/Ride"
import { Cigarette, CigaretteOff, HeadphoneOff, Headphones, MessageSquare, MessageSquareOff, PawPrint } from 'lucide-react';
import styles from '../Ride.module.css';

const RidePreferences = ({ icon, ifTrue, className }: { icon: RidePreferencesEnum, ifTrue: boolean, className?: string }) => {
    switch (icon) {
        case RidePreferencesEnum.openToConversation:
            return (
                <span className={className} title={ifTrue ? `Open to conversation` : `Not open to conversation`}>
                    {ifTrue ? (<MessageSquare className='size-5 dark:text-dodger-blue' />) : (<MessageSquareOff className='size-5 text-pale-sky' />)}
                </span>)
        case RidePreferencesEnum.musicAllowed:
            return (
                <span className={className} title={ifTrue ? `Music allowed` : `Music not allowed`}>
                    {ifTrue ? (<Headphones className='size-5 dark:text-dodger-blue' />) : (<HeadphoneOff className='size-5 text-pale-sky' />)}
                </span>)
        case RidePreferencesEnum.noSmoking:
            return (
                <span className={className} title={ifTrue ? `No smoking` : `Smoking`}>
                    {!ifTrue ? (<Cigarette className='size-5 dark:text-dodger-blue' />) : (<CigaretteOff className='size-5 text-pale-sky' />)}
                </span>)
        case RidePreferencesEnum.petsWelcomed:
            return (
                <span
                className={`relative ${className} ${!ifTrue ? `text-pale-sky` : 'dark:text-dodger-blue'}`}
                title={ifTrue ? `Pets welcomed` : `Pets not welcomed`}
                >
                    {!ifTrue && <i className="fa-solid fa-slash absolute top-0.5 start-0"/>}        
                    <PawPrint className='size-5' />
                </span>)
        default:        
            return null;
    }
}

export default RidePreferences
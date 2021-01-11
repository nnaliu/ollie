import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import appointment from './assets/appointment.jpg';
import business from './assets/business.jpg';
import introduction from './assets/introduction.jpg';
import restaurant from './assets/restaurant.jpg';
import shopping from './assets/shopping.jpg';
import travel from './assets/travel.jpg';
import weekend from './assets/weekend2.jpg';


function SelectionScreen() {
  const prompt_start = 'This is a chat between Ollie and User. ';
  const scenarios = [
    { type: 'Introduction', img: introduction, prompt: prompt_start + 'Ollie is an English chatbot engaging in a friendly conversation to get to know each other and answers in language a first grader would understand.' },
    { type: 'At the Restaurant', img: restaurant, prompt: prompt_start + 'Ollie is an English chatbot sitting with a friend at the restaurant. Ollie decides what to eat and helps order food.' },
    { type: 'Appointment', img: appointment, prompt: prompt_start + 'Ollie is an English receptionist at an office. Ollie helps with setting up an appointment.' },
    { type: 'Shopping Trip', img: shopping, prompt: prompt_start + 'Ollie is an English friend accompanying the participant on a shopping trip. Ollie asks about what to buy and helps you pay at the cashier.' },
    { type: 'Weekend Plans', img: weekend, prompt: prompt_start + 'Ollie is an English chatbot asking the participant about their weekend. Ollie speaks using language a first grader would understand.' },
    { type: 'Planning Travel', img: travel, prompt: prompt_start + 'Ollie is an English chatbot. Ollie is planning a trip with the participant to travel abroad.' },
    { type: 'Business Meeting', img: business, prompt: prompt_start + 'Ollie is an English chatbot who is having a business meeting with the participant and asking questions about how the business is doing.' },
    // { type: '', instructions: '' },
    // Images: @catalyststuff on freepik
  ];

  return (
    <div className='body-container'>
      <div className='scenario-list'>
        {scenarios.map(scenario =>
          <Link className='scenario' to={{
            pathname: '/chat',
            state: {
              type: scenario.type,
              prompt: scenario.prompt
            }
          }} key={scenario.type}>
            <div className='img-wrapper'>
              <img src={scenario.img} alt='Scenario'/>
            </div>
            <h4>{scenario.type}</h4>
          </Link>
        )}
      </div>
    </div>
  );
}

export default SelectionScreen;
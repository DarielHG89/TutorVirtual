import React from "react";
import type { MascotEmotion } from "../../../context/MascotContext";

interface PuppyDisplayProps {
  emotion: MascotEmotion;
  isDragging: boolean;
  isBouncing: boolean;
  isBlinking: boolean;
  isSpeaking: boolean;
  isFetching?: boolean;
  isEating?: boolean;
}

export const PuppyDisplay: React.FC<PuppyDisplayProps> = ({
  emotion,
  isDragging,
  isBouncing,
  isBlinking,
  isSpeaking,
  isFetching = false,
  isEating = false,
}) => {
  const isSleeping = emotion === "sleeping";
  const isHappy = emotion === "happy" || emotion === "success";
  const isThinking = emotion === "thinking" || emotion === "hint_suggestion";
  const isError = emotion === "error";
  const isDizzy = emotion === "dizzy";
  const isSurprised = emotion === "surprised";

  // Fur colors
  const mainFur = "#d97706"; // Warm orange/caramel
  const lightFur = "#ffedd5"; // Light cream chest/snout/inner ears
  const darkDetail = "#1e293b"; // Dark charcoal nose/eyes/claws
  const collarCol = "#10b981"; // Emerald green collar
  const tagCol = "#f59e0b"; // Golden tag
  const tongueCol = "#fb7185"; // Pink tongue

  return (
    <>
      <style>
        {`
          /* Keyframes for Puppy */
          @keyframes puppyBreathe {
            0%, 100% { transform: scaleY(1) translateY(0); }
            50% { transform: scaleY(1.03) translateY(-1px); }
          }
          @keyframes puppyTailWag {
            0%, 100% { transform: rotate(-8deg); }
            50% { transform: rotate(18deg); }
          }
          @keyframes puppyTailWagFast {
            0%, 100% { transform: rotate(-15deg); }
            50% { transform: rotate(35deg); }
          }
          @keyframes puppyTailSleeping {
            0%, 100% { transform: rotate(-2deg); }
            50% { transform: rotate(4deg); }
          }
          @keyframes puppyEarL {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(-5deg) translateY(-1px); }
          }
          @keyframes puppyEarR {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(5deg) translateY(-1px); }
          }
          @keyframes puppyEarHappy {
            0%, 100% { transform: rotate(-10deg) translateY(-2px); }
            50% { transform: rotate(10deg) translateY(1px); }
          }
          @keyframes puppySadEarsL {
            0%, 100% { transform: rotate(12deg) translateY(1px); }
            50% { transform: rotate(15deg) translateY(3px); }
          }
          @keyframes puppySadEarsR {
            0%, 100% { transform: rotate(-12deg) translateY(1px); }
            50% { transform: rotate(-15deg) translateY(3px); }
          }
          @keyframes puppyBounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-12px) scale(0.96, 1.05); }
          }
          @keyframes puppyHeadTilt {
            0%, 100% { transform: rotate(-10deg); }
            50% { transform: rotate(-12deg) translateY(1px); }
          }
          @keyframes puppySleepSnore {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.05) translateY(-0.5px); opacity: 1; }
          }
          @keyframes puppyBallFetch {
            0% { transform: translate(110px, -20px) rotate(0deg); opacity: 1; }
            40% { transform: translate(50px, 35px) rotate(180deg); opacity: 1; }
            45% { transform: translate(35px, 45px) rotate(360deg); opacity: 0; }
            100% { transform: translate(35px, 45px) opacity: 0; }
          }
          @keyframes puppyFetchMove {
            0% { transform: translateX(0) scaleX(1); }
            20% { transform: translateX(20px) scaleX(1.1); }
            40% { transform: translateX(45px) scaleX(1); }
            43% { transform: translateX(45px) scaleX(-1); }
            70% { transform: translateX(15px) scaleX(-1.05); }
            85%, 100% { transform: translateX(0) scaleX(1); }
          }
          @keyframes puppyMunch {
            0%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(0.7) translateY(2px); }
          }
          @keyframes boneFallAnim {
            0% { transform: translateY(-40px) rotate(0deg); opacity: 0; }
            20% { opacity: 1; }
            60% { transform: translateY(28px) rotate(120deg); opacity: 1; }
            100% { transform: translateY(32px) rotate(180deg); opacity: 0; }
          }
          @keyframes puppyWhimper {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(-1px, 0.5px); }
            75% { transform: translate(1px, -0.5px); }
          }

          /* Scoped classes */
          .puppy-container {
            transform-origin: bottom center;
            animation: puppyBreathe 3.5s ease-in-out infinite;
          }
          .puppy-wag {
            transform-origin: 32px 75px;
            animation: puppyTailWag 0.5s ease-in-out infinite;
          }
          .puppy-wag-fast {
            transform-origin: 32px 75px;
            animation: puppyTailWagFast 0.2s linear infinite;
          }
          .puppy-wag-slow {
            transform-origin: 32px 75px;
            animation: puppyTailSleeping 2.5s ease-in-out infinite;
          }
          .puppy-ear-l {
            transform-origin: 43px 26px;
            animation: puppyEarL 3s ease-in-out infinite;
          }
          .puppy-ear-r {
            transform-origin: 77px 26px;
            animation: puppyEarR 3s ease-in-out infinite 0.2s;
          }
          .puppy-ear-happy-l {
            transform-origin: 43px 26px;
            animation: puppyEarHappy 0.4s ease-in-out infinite;
          }
          .puppy-ear-happy-r {
            transform-origin: 77px 26px;
            animation: puppyEarHappy 0.4s ease-in-out infinite reverse;
          }
          .puppy-ear-sad-l {
            transform-origin: 43px 26px;
            animation: puppySadEarsL 2s ease-in-out infinite;
          }
          .puppy-ear-sad-r {
            transform-origin: 77px 26px;
            animation: puppySadEarsR 2s ease-in-out infinite;
          }
          .puppy-tilt {
            transform-origin: 60px 48px;
            animation: puppyHeadTilt 2s ease-in-out infinite;
          }
          .puppy-jump {
            animation: puppyBounce 0.6s ease-out infinite;
          }
          .puppy-fetch {
            animation: puppyFetchMove 2s ease-in-out forwards;
          }
          .puppy-munching-mouth {
            transform-origin: 60px 48px;
            animation: puppyMunch 0.3s ease-out infinite;
          }
          .toy-ball {
            transform-origin: center;
            animation: puppyBallFetch 2s ease-in-out forwards;
          }
          .munch-bone {
            transform-origin: center;
            animation: boneFallAnim 1.8s ease-in-out forwards;
          }
          .puppy-whimper-style {
            animation: puppyWhimper 0.4s ease-in-out infinite;
          }
          .snore-z {
            animation: sleepZFloat 3s infinite ease-in-out;
            opacity: 0;
            transform-origin: bottom left;
          }
          @keyframes sleepZFloat {
            0% { opacity: 0; transform: translate(0, 0) scale(0.6); }
            30% { opacity: 0.8; }
            100% { opacity: 0; transform: translate(15px, -30px) scale(1.1); }
          }
        `}
      </style>

      <svg
        viewBox="0 0 120 120"
        className="w-full h-full drop-shadow-xl overflow-visible pointer-events-auto"
      >
        <defs>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Shadow below Puppy */}
        <ellipse
          cx="60"
          cy="112"
          rx="22"
          ry="3.5"
          fill="#1e293b"
          opacity={isDragging ? "0.08" : isSleeping ? "0.15" : "0.22"}
        />

        {/* FETCH TOY GAME: Tennis Ball */}
        {isFetching && (
          <g className="toy-ball shadow-md">
            <circle cx="0" cy="0" r="8" fill="#a3e635" stroke="#4d7c0f" strokeWidth="1" />
            <path d="M -5.5 -5.5 Q 0 0 -5.5 5.5" stroke="#fff" strokeWidth="1" fill="none" opacity="0.8" />
            <path d="M 5.5 -5.5 Q 0 0 5.5 5.5" stroke="#fff" strokeWidth="1" fill="none" opacity="0.8" />
          </g>
        )}

        {/* FEEDING GAME: Falling Bone */}
        {isEating && (
          <g className="munch-bone" transform="translate(60, 40)">
            {/* The bone shape */}
            <path
              d="M -12,0 C -12,-4 -8,-4 -8,0 C -8,2 -4,2 0,2 C 4,2 8,2 8,0 C 8,-4 12,-4 12,0 C 12,4 8,4 8,2 Q 0,4 -8,2 C -8,4 -12,4 -12,0 Z"
              fill="#f1f5f9"
              stroke="#cbd5e1"
              strokeWidth="1.5"
            />
            {/* Soft shadow */}
            <path
              d="M -6,1 L 6,1"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.5"
            />
          </g>
        )}

        {/* Extra Sleepy Floating Z's */}
        {isSleeping && (
          <g transform="translate(85, 45)">
            <text x="0" y="0" fontSize="11" fontWeight="bold" fill="#3b82f6" className="snore-z" style={{ animationDelay: "0s" }}>Z</text>
            <text x="8" y="-10" fontSize="15" fontWeight="bold" fill="#60a5fa" className="snore-z" style={{ animationDelay: "1s" }}>Z</text>
            <text x="18" y="-22" fontSize="18" fontWeight="bold" fill="#93c5fd" className="snore-z" style={{ animationDelay: "2s" }}>Z</text>
          </g>
        )}

        {/* MAIN PUPPY GROUP */}
        <g
          className={`
            ${isHappy ? "puppy-jump" : ""} 
            ${isFetching ? "puppy-fetch" : ""} 
            ${isError ? "puppy-whimper-style" : ""}
          `}
          filter="url(#shadow)"
        >
          <g className="puppy-container">
            
            {/* 1. TAIL */}
            {isSleeping ? (
              <path
                d="M 36 78 Q 22 72 26 62"
                fill="none"
                stroke={mainFur}
                strokeWidth="7"
                strokeLinecap="round"
                className="puppy-wag-slow"
              />
            ) : isHappy ? (
              <path
                d="M 33 76 Q 16 68 22 50"
                fill="none"
                stroke={mainFur}
                strokeWidth="8"
                strokeLinecap="round"
                className="puppy-wag-fast"
              />
            ) : (
              <path
                d="M 34 76 Q 18 64 24 52"
                fill="none"
                stroke={mainFur}
                strokeWidth="8"
                strokeLinecap="round"
                className="puppy-wag"
              />
            )}

            {/* 2. BODY / OVERALL SHAPE */}
            {isSleeping ? (
              // Curled up sleeping body
              <g>
                <ellipse cx="60" cy="85" rx="32" ry="24" fill={mainFur} />
                <ellipse cx="60" cy="89" rx="26" ry="18" fill="#b45309" opacity="0.1" /> {/* Shadow */}
                <circle cx="42" cy="94" r="7" fill={mainFur} /> {/* Back paw */}
                <circle cx="78" cy="94" r="7" fill={mainFur} /> {/* Front paw curled */}
                <circle cx="42" cy="94" r="5" fill={lightFur} />
                <circle cx="78" cy="94" r="5" fill={lightFur} />
              </g>
            ) : (
              // Standing/sitting active body
              <g>
                {/* Back legs */}
                <ellipse cx="40" cy="95" rx="14" ry="10" fill="#b45309" />
                <circle cx="34" cy="103" r="6" fill={lightFur} />
                
                {/* Front Chest & Sitting Body */}
                <path
                  d="M 40 68 L 80 68 L 76 104 L 44 104 Z"
                  fill={mainFur}
                />
                
                {/* Creamy white chest patch */}
                <path
                  d="M 52 68 Q 60 92 68 68 Q 60 76 52 68 Z"
                  fill={lightFur}
                />

                {/* Left Front Leg */}
                <rect x="44" y="86" width="10" height="20" rx="4" fill={mainFur} />
                <circle cx="49" cy="104" r="6.5" fill={lightFur} />

                {/* Right Front Leg */}
                <rect x="66" y="86" width="10" height="20" rx="4" fill={mainFur} />
                <circle cx="71" cy="104" r="6.5" fill={lightFur} />

                {/* Little paws detail / claws */}
                <line x1="46" y1="102" x2="46" y2="105" stroke={darkDetail} strokeWidth="1" strokeLinecap="round" opacity="0.3" />
                <line x1="49" y1="102" x2="49" y2="105" stroke={darkDetail} strokeWidth="1" strokeLinecap="round" opacity="0.3" />
                <line x1="52" y1="102" x2="52" y2="105" stroke={darkDetail} strokeWidth="1" strokeLinecap="round" opacity="0.3" />

                <line x1="68" y1="102" x2="68" y2="105" stroke={darkDetail} strokeWidth="1" strokeLinecap="round" opacity="0.3" />
                <line x1="71" y1="102" x2="71" y2="105" stroke={darkDetail} strokeWidth="1" strokeLinecap="round" opacity="0.3" />
                <line x1="74" y1="102" x2="74" y2="105" stroke={darkDetail} strokeWidth="1" strokeLinecap="round" opacity="0.3" />
              </g>
            )}

            {/* 3. COLLAR (If not sleeping, or visible around neck roll) */}
            {!isSleeping && (
              <g>
                <path
                  d="M 46 68 Q 60 74 74 68"
                  fill="none"
                  stroke={collarCol}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {/* Golden dog Medal tag */}
                <circle cx="60" cy="74" r="4.5" fill={tagCol} stroke="#d97706" strokeWidth="0.5" />
                <path d="M 59 71 L 61 71 L 61 75 L 59 75 Z" fill="#fff" opacity="0.5" /> {/* Highlight */}
              </g>
            )}

            {/* 4. HEAD GROUP */}
            <g className={`
              ${isThinking ? "puppy-tilt" : ""} 
              ${isSleeping ? "translate-y-4 translate-x-1" : ""}
            `}>
              {/* Ear background shadows */}
              <ellipse cx="43" cy="28" rx="7" ry="4" fill="#92400e" opacity="0.3" />
              <ellipse cx="77" cy="28" rx="7" ry="4" fill="#92400e" opacity="0.3" />

              {/* EAR LEFT */}
              <g className={`
                ${isHappy ? "puppy-ear-happy-l" : isError ? "puppy-ear-sad-l" : "puppy-ear-l"}
              `}>
                {/* Outer Ear */}
                <ellipse cx="40" cy="38" rx="8" ry="18" fill={mainFur} transform="rotate(-15, 40, 38)" />
                {/* Inner Ear pinkish light fur */}
                <ellipse cx="41" cy="38" rx="5" ry="14" fill="#fee2e2" transform="rotate(-15, 41, 38)" />
                <ellipse cx="41" cy="38" rx="3.5" ry="11" fill="#fca5a5" transform="rotate(-15, 41, 38)" opacity="0.4" />
              </g>

              {/* EAR RIGHT */}
              <g className={`
                ${isHappy ? "puppy-ear-happy-r" : isError ? "puppy-ear-sad-r" : "puppy-ear-r"}
              `}>
                {/* Outer Ear */}
                <ellipse cx="80" cy="38" rx="8" ry="18" fill={mainFur} transform="rotate(15, 80, 38)" />
                {/* Inner Ear */}
                <ellipse cx="79" cy="38" rx="5" ry="14" fill="#fee2e2" transform="rotate(15, 79, 38)" />
                <ellipse cx="79" cy="38" rx="3.5" ry="11" fill="#fca5a5" transform="rotate(15, 79, 38)" opacity="0.4" />
              </g>

              {/* HEAD BASE */}
              <ellipse cx="60" cy="48" rx="22" ry="18" fill={mainFur} />
              
              {/* Cute white brow patches */}
              <ellipse cx="50" cy="39" rx="5.5" ry="3.5" fill={lightFur} opacity="0.8" transform="rotate(-10, 50, 39)" />
              <ellipse cx="70" cy="39" rx="5.5" ry="3.5" fill={lightFur} opacity="0.8" transform="rotate(10, 70, 39)" />

              {/* 5. EYES */}
              {isSleeping ? (
                // Sleeping eyes (peaceful curves)
                <g stroke={darkDetail} strokeWidth="2.5" strokeLinecap="round" fill="none">
                  <path d="M 46 44 Q 50 48 54 44" />
                  <path d="M 66 44 Q 70 48 74 44" />
                </g>
              ) : isDizzy ? (
                // Dizzy eyes (crosses)
                <g stroke={darkDetail} strokeWidth="2" strokeLinecap="round">
                  <line x1="46" y1="41" x2="52" y2="47" />
                  <line x1="52" y1="41" x2="46" y2="47" />
                  <line x1="68" y1="41" x2="74" y2="47" />
                  <line x1="74" y1="41" x2="68" y2="47" />
                </g>
              ) : isBlinking ? (
                // Blink lines
                <g stroke={darkDetail} strokeWidth="2.5" strokeLinecap="round" fill="none">
                  <line x1="45" y1="44" x2="53" y2="44" />
                  <line x1="67" y1="44" x2="75" y2="44" />
                </g>
              ) : (
                // Regular open shining eyes
                <g>
                  {/* Left Sclera */}
                  <circle cx="49" cy="44" r="5.5" fill={darkDetail} />
                  {/* Shiny Highlights */}
                  <circle cx="47.5" cy="42" r="1.8" fill="#ffffff" />
                  <circle cx="50.5" cy="45.5" r="0.8" fill="#ffffff" />

                  {/* Right Sclera */}
                  <circle cx="71" cy="44" r="5.5" fill={darkDetail} />
                  {/* Shiny Highlights */}
                  <circle cx="69.5" cy="42" r="1.8" fill="#ffffff" />
                  <circle cx="72.5" cy="45.5" r="0.8" fill="#ffffff" />
                </g>
              )}

              {/* 6. SNOUT & NOSE */}
              <g>
                <ellipse cx="60" cy="54" rx="10" ry="7.5" fill={lightFur} />
                
                {/* Cute black/charcoal snout nose */}
                <ellipse cx="60" cy="50" rx="4.5" ry="3" fill="#0f172a" />
                {/* Shiny speck on nose */}
                <ellipse cx="58.8" cy="49" rx="1" ry="0.6" fill="#fff" opacity="0.9" />

                {/* Mouth Line */}
                <path d="M 57 54 Q 60 56 63 54" stroke={darkDetail} strokeWidth="1.2" fill="none" strokeLinecap="round" />

                {/* Mouth Open with Tongue out! (when happy, speaking, fetching, eating, or surprised) */}
                {(isHappy || isSpeaking || isFetching || isEating || isSurprised) && (
                  <g className={isEating ? "puppy-munching-mouth" : ""}>
                    {/* Pink/Rose opening mouth and tongue */}
                    <path
                      d="M 57 54 C 57 60 63 60 63 54 Z"
                      fill="#7f1d1d"
                    />
                    <path
                      d="M 58 55.5 C 58 61 62 61 62 55.5 Z"
                      fill={tongueCol}
                    />
                    {/* Tongue notch */}
                    <line x1="60" y1="56" x2="60" y2="59.5" stroke="#be123c" strokeWidth="0.8" opacity="0.6" />
                  </g>
                )}
              </g>

            </g> {/* End Head Group */}

          </g> {/* End Puppy Container */}
        </g> {/* End overall modifiers */}
      </svg>
    </>
  );
};

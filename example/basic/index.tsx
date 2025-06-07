import { StrictMode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';

import Markdown from '../../src';
import json from './data.json';

function throttle(fn: (...args: any[]) => void, delay: number) {
  let lastTime = 0;
  return (...args: unknown[]) => {
    const now = Date.now();
    if (now - lastTime > delay) {
      fn(...args);
      lastTime = now;
    }
  };
}

const BasicDemo = () => {
  const [thinkingContent, setThinkingContent] = useState('');
  const [answerContent, setAnswerContent] = useState('');
  const messageDivRef = useRef<HTMLDivElement>(null!);

  const scrollCacheRef = useRef<{
    type: 'manual' | 'auto';
    needAutoScroll: boolean;
    prevScrollTop: number;
  }>({
    type: 'manual',
    needAutoScroll: true,
    prevScrollTop: 0,
  });

  const onClick = () => {
    setAnswerContent(json.content);
  };
  const onReset = () => {
    setThinkingContent('');
    setAnswerContent('');
  };

  const throttleOnTypedChar = useMemo(() => {
    return throttle(() => {
      if (!scrollCacheRef.current.needAutoScroll) return;
      const messageDiv = messageDivRef.current;
      // Automatically scroll to the bottom
      if (messageDiv) {
        messageDiv.scrollTo({
          top: messageDiv.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 50);
  }, []);

  const onScroll = useMemo(() => {
    return throttle((e: React.UIEvent<HTMLDivElement>) => {
      // If scrolling up, it means the user is manually scrolling, so stop the auto-scroll
      // console.log(e.currentTarget.scrollTop - scrollCacheRef.current.prevScrollTop);
      if (e.currentTarget.scrollTop < scrollCacheRef.current.prevScrollTop) {
        scrollCacheRef.current.needAutoScroll = false;
      }
      scrollCacheRef.current.prevScrollTop = e.currentTarget.scrollTop;
    }, 50);
  }, []);

  return (
    <div className="ds-message">
      <div className="ds-message-actions">
        {thinkingContent ? <button onClick={onReset}>Reset</button> : <button onClick={onClick}>Show</button>} <span style={{ marginLeft: 30 }}>What are the new features in React 19?</span>
      </div>
      <div className="ds-message-box" ref={messageDivRef} onScroll={onScroll}>
        <div className="ds-message-list">
          {answerContent && (
            <Markdown
              interval={0}
              answerType="answer"
              // onEnd={(args) => {
              //   console.log('Thinking finished', args);
              //   if (thinkingContent) {
              //     setAnswerContent(json.content);
              //   }
              // }}
              // onStart={(args) => {
              //   console.log('Thinking started', args);
              // }}
              // onTypedChar={(args) => {
              //   console.log('Typing', args);
              // }}
              onTypedChar={throttleOnTypedChar}
              theme='dark'
            >
              {answerContent}
            </Markdown>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicDemo;

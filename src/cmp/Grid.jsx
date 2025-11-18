import React from 'react';

export default function Grid() {
    return (
        <>
            <div className="egrid">
                {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className="ebox"></div>
                ))}
            </div>
        </>
    );
};
'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import {
  buggyQuestions,
  categoryLabel,
  questionCategories,
  questionPath,
  type QuestionCategory,
  type QuestionDestination,
  type QuestionLocale,
} from '../lib/buggyQuestions';

export default function QuestionsDirectory({ locale }: { locale: QuestionLocale }) {
  const isEn = locale === 'en';
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<QuestionCategory | 'all'>('all');
  const [destination, setDestination] = useState<QuestionDestination | 'all'>('all');

  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase(locale);
    return buggyQuestions.filter((question) => {
      const content = `${question[locale].question} ${question[locale].answer}`.toLocaleLowerCase(locale);
      return (!term || content.includes(term))
        && (category === 'all' || question.category === category)
        && (destination === 'all' || question.destination === destination || question.destination === 'general');
    });
  }, [category, destination, locale, search]);

  return (
    <div className="question-directory">
      <div className="question-toolbar" aria-label={isEn ? 'Filter questions' : 'Filtrar preguntas'}>
        <label className="question-search">
          <Search size={19} />
          <span className="sr-only">{isEn ? 'Search questions' : 'Buscar preguntas'}</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={isEn ? 'Search price, pickup, children, Macao…' : 'Busca precio, recogida, niños, Macao…'}
          />
        </label>
        <select value={category} onChange={(event) => setCategory(event.target.value as QuestionCategory | 'all')} aria-label={isEn ? 'Question category' : 'Categoría de pregunta'}>
          <option value="all">{isEn ? 'All topics' : 'Todos los temas'}</option>
          {questionCategories.map((item) => <option key={item.id} value={item.id}>{item[locale]}</option>)}
        </select>
        <select value={destination} onChange={(event) => setDestination(event.target.value as QuestionDestination | 'all')} aria-label={isEn ? 'Destination' : 'Destino'}>
          <option value="all">{isEn ? 'All destinations' : 'Todos los destinos'}</option>
          <option value="punta-cana">Punta Cana</option>
          <option value="bayahibe">Bayahibe / La Romana</option>
        </select>
      </div>

      <p className="question-results" aria-live="polite">
        <b>{filtered.length}</b> {isEn ? 'answers found' : 'respuestas encontradas'}
      </p>

      {questionCategories.map((categoryItem) => {
        const questions = filtered.filter((question) => question.category === categoryItem.id);
        if (!questions.length) return null;

        return (
          <section className="question-category" key={categoryItem.id} id={categoryItem.id}>
            <div className="question-category-head">
              <span>{String(questionCategories.indexOf(categoryItem) + 1).padStart(2, '0')}</span>
              <h2>{categoryLabel(categoryItem.id, locale)}</h2>
              <b>{questions.length}</b>
            </div>
            <div className="question-list">
              {questions.map((question, index) => (
                <details key={question.id} open={!search && category === 'all' && index === 0}>
                  <summary>
                    <span>{question[locale].question}</span>
                    <b>+</b>
                  </summary>
                  <div>
                    <p>{question[locale].answer}</p>
                    <a href={questionPath(question, locale)} data-track-event="question_landing_click" data-track-label={question[locale].question}>
                      {isEn ? 'Read the complete booking guide' : 'Ver la guía completa para reservar'} <ArrowRight size={17} />
                    </a>
                  </div>
                </details>
              ))}
            </div>
          </section>
        );
      })}

      {!filtered.length ? (
        <div className="question-empty">
          <h2>{isEn ? 'No exact answer found.' : 'No encontramos esa respuesta exacta.'}</h2>
          <p>{isEn ? 'Try another word or ask the booking team on WhatsApp.' : 'Prueba otra palabra o consulta al equipo de reservas por WhatsApp.'}</p>
        </div>
      ) : null}
    </div>
  );
}

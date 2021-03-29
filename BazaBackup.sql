--
-- PostgreSQL database dump
--

-- Dumped from database version 12.1
-- Dumped by pg_dump version 12.1

-- Started on 2021-03-29 22:30:44

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2884 (class 1262 OID 65620)
-- Name: Wypo; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE "Wypo" WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'Polish_Poland.1250' LC_CTYPE = 'Polish_Poland.1250';


ALTER DATABASE "Wypo" OWNER TO postgres;

\connect "Wypo"

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 209 (class 1259 OID 65659)
-- Name: car; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.car (
    car_id integer NOT NULL,
    nazwa text NOT NULL,
    marka text NOT NULL,
    model text NOT NULL,
    opis text NOT NULL,
    place_id integer NOT NULL,
    type_id integer NOT NULL,
    price double precision,
    photo bytea
);


ALTER TABLE public.car OWNER TO postgres;

--
-- TOC entry 208 (class 1259 OID 65657)
-- Name: car_car_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.car_car_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.car_car_id_seq OWNER TO postgres;

--
-- TOC entry 2885 (class 0 OID 0)
-- Dependencies: 208
-- Name: car_car_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.car_car_id_seq OWNED BY public.car.car_id;


--
-- TOC entry 211 (class 1259 OID 65670)
-- Name: place; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.place (
    place_id integer NOT NULL,
    address text NOT NULL
);


ALTER TABLE public.place OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 65668)
-- Name: place_place_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.place_place_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.place_place_id_seq OWNER TO postgres;

--
-- TOC entry 2886 (class 0 OID 0)
-- Dependencies: 210
-- Name: place_place_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.place_place_id_seq OWNED BY public.place.place_id;


--
-- TOC entry 205 (class 1259 OID 65635)
-- Name: rental; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rental (
    rental_id integer NOT NULL,
    user_id numeric NOT NULL,
    car_id numeric NOT NULL,
    status_id numeric NOT NULL,
    start date NOT NULL,
    "end" date NOT NULL,
    rental_date date NOT NULL,
    price double precision
);


ALTER TABLE public.rental OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 65633)
-- Name: rental_rental_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rental_rental_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.rental_rental_id_seq OWNER TO postgres;

--
-- TOC entry 2887 (class 0 OID 0)
-- Dependencies: 204
-- Name: rental_rental_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rental_rental_id_seq OWNED BY public.rental.rental_id;


--
-- TOC entry 207 (class 1259 OID 65648)
-- Name: status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.status (
    status_id integer NOT NULL,
    status text NOT NULL
);


ALTER TABLE public.status OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 65646)
-- Name: statuses_status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.statuses_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.statuses_status_id_seq OWNER TO postgres;

--
-- TOC entry 2888 (class 0 OID 0)
-- Dependencies: 206
-- Name: statuses_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.statuses_status_id_seq OWNED BY public.status.status_id;


--
-- TOC entry 213 (class 1259 OID 65681)
-- Name: type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.type (
    type_id integer NOT NULL,
    type text NOT NULL
);


ALTER TABLE public.type OWNER TO postgres;

--
-- TOC entry 212 (class 1259 OID 65679)
-- Name: type_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.type_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.type_type_id_seq OWNER TO postgres;

--
-- TOC entry 2889 (class 0 OID 0)
-- Dependencies: 212
-- Name: type_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.type_type_id_seq OWNED BY public.type.type_id;


--
-- TOC entry 202 (class 1259 OID 65621)
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    user_id integer NOT NULL,
    name text NOT NULL,
    surname text NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    company text,
    password text NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- TOC entry 203 (class 1259 OID 65624)
-- Name: user_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_user_id_seq OWNER TO postgres;

--
-- TOC entry 2890 (class 0 OID 0)
-- Dependencies: 203
-- Name: user_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_user_id_seq OWNED BY public."user".user_id;


--
-- TOC entry 2726 (class 2604 OID 65662)
-- Name: car car_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.car ALTER COLUMN car_id SET DEFAULT nextval('public.car_car_id_seq'::regclass);


--
-- TOC entry 2727 (class 2604 OID 65673)
-- Name: place place_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place ALTER COLUMN place_id SET DEFAULT nextval('public.place_place_id_seq'::regclass);


--
-- TOC entry 2724 (class 2604 OID 65638)
-- Name: rental rental_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rental ALTER COLUMN rental_id SET DEFAULT nextval('public.rental_rental_id_seq'::regclass);


--
-- TOC entry 2725 (class 2604 OID 65651)
-- Name: status status_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.status ALTER COLUMN status_id SET DEFAULT nextval('public.statuses_status_id_seq'::regclass);


--
-- TOC entry 2728 (class 2604 OID 65684)
-- Name: type type_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type ALTER COLUMN type_id SET DEFAULT nextval('public.type_type_id_seq'::regclass);


--
-- TOC entry 2723 (class 2604 OID 65626)
-- Name: user user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user" ALTER COLUMN user_id SET DEFAULT nextval('public.user_user_id_seq'::regclass);


--
-- TOC entry 2874 (class 0 OID 65659)
-- Dependencies: 209
-- Data for Name: car; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.car (car_id, nazwa, marka, model, opis, place_id, type_id, price, photo) VALUES (1, 'AA', 'AA', '12', 'qweqwe', 1, 1, NULL, NULL);
INSERT INTO public.car (car_id, nazwa, marka, model, opis, place_id, type_id, price, photo) VALUES (2, 'AA', 'AA', '12', 'qweqwe', 2, 2, NULL, NULL);


--
-- TOC entry 2876 (class 0 OID 65670)
-- Dependencies: 211
-- Data for Name: place; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.place (place_id, address) VALUES (1, 'krakow');
INSERT INTO public.place (place_id, address) VALUES (2, 'warszawa');


--
-- TOC entry 2870 (class 0 OID 65635)
-- Dependencies: 205
-- Data for Name: rental; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.rental (rental_id, user_id, car_id, status_id, start, "end", rental_date, price) VALUES (2, 1, 1, 1, '2021-01-01', '2021-03-08', '2021-01-01', 30);
INSERT INTO public.rental (rental_id, user_id, car_id, status_id, start, "end", rental_date, price) VALUES (1, 1, 1, 2, '2022-01-08', '2022-03-08', '2022-01-01', 20);


--
-- TOC entry 2872 (class 0 OID 65648)
-- Dependencies: 207
-- Data for Name: status; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.status (status_id, status) VALUES (1, 'WAITING');
INSERT INTO public.status (status_id, status) VALUES (2, 'APPROVED');
INSERT INTO public.status (status_id, status) VALUES (3, 'CANCELED');


--
-- TOC entry 2878 (class 0 OID 65681)
-- Dependencies: 213
-- Data for Name: type; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.type (type_id, type) VALUES (1, 'qwe');
INSERT INTO public.type (type_id, type) VALUES (2, 'ewq');


--
-- TOC entry 2867 (class 0 OID 65621)
-- Dependencies: 202
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."user" (user_id, name, surname, username, email, company, password) VALUES (1, 'Jan', 'Kowalski', 'jk2', 'jan@man.pl', 'Habadzibadlo', '123123');
INSERT INTO public."user" (user_id, name, surname, username, email, company, password) VALUES (2, 'Wojciech', 'Nowak', 'John', 'mail@mail.com', 'ZiemniakKompany', '123');
INSERT INTO public."user" (user_id, name, surname, username, email, company, password) VALUES (3, 'Wojciech', 'Nowak', 'John', 'mail@mail.com', 'ZiemniakKompany', '123');
INSERT INTO public."user" (user_id, name, surname, username, email, company, password) VALUES (4, 'Wojciech', 'Nowak', 'John', 'mail@mail.com', 'ZiemniakKompany', '123');
INSERT INTO public."user" (user_id, name, surname, username, email, company, password) VALUES (5, 'Wojciech', 'Nowak', 'John', 'mail@mail.com', 'ZiemniakKompany', '123');
INSERT INTO public."user" (user_id, name, surname, username, email, company, password) VALUES (6, 'Wojciech', 'Nowak', 'John', 'mail@mail.com', 'ZiemniakKompany', '123');
INSERT INTO public."user" (user_id, name, surname, username, email, company, password) VALUES (7, 'Wojciech', 'Nowak', 'John', 'mail@mail.com', 'ZiemniakKompany', '123');
INSERT INTO public."user" (user_id, name, surname, username, email, company, password) VALUES (8, 'Wojciech', 'Nowak', 'John', 'mail@mail.com', 'ZiemniakKompany', '123');
INSERT INTO public."user" (user_id, name, surname, username, email, company, password) VALUES (9, 'Wojciech', 'Nowak', 'John', 'mail@mail.com', 'ZiemniakKompany', '123');


--
-- TOC entry 2891 (class 0 OID 0)
-- Dependencies: 208
-- Name: car_car_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.car_car_id_seq', 2, true);


--
-- TOC entry 2892 (class 0 OID 0)
-- Dependencies: 210
-- Name: place_place_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.place_place_id_seq', 2, true);


--
-- TOC entry 2893 (class 0 OID 0)
-- Dependencies: 204
-- Name: rental_rental_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rental_rental_id_seq', 2, true);


--
-- TOC entry 2894 (class 0 OID 0)
-- Dependencies: 206
-- Name: statuses_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.statuses_status_id_seq', 3, true);


--
-- TOC entry 2895 (class 0 OID 0)
-- Dependencies: 212
-- Name: type_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.type_type_id_seq', 2, true);


--
-- TOC entry 2896 (class 0 OID 0)
-- Dependencies: 203
-- Name: user_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_user_id_seq', 9, true);


--
-- TOC entry 2736 (class 2606 OID 65667)
-- Name: car car_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.car
    ADD CONSTRAINT car_pkey PRIMARY KEY (car_id);


--
-- TOC entry 2738 (class 2606 OID 65678)
-- Name: place place_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.place
    ADD CONSTRAINT place_pkey PRIMARY KEY (place_id);


--
-- TOC entry 2732 (class 2606 OID 65640)
-- Name: rental rental_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rental
    ADD CONSTRAINT rental_pkey PRIMARY KEY (rental_id);


--
-- TOC entry 2734 (class 2606 OID 65656)
-- Name: status statuses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.status
    ADD CONSTRAINT statuses_pkey PRIMARY KEY (status_id);


--
-- TOC entry 2740 (class 2606 OID 65689)
-- Name: type type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type
    ADD CONSTRAINT type_pkey PRIMARY KEY (type_id);


--
-- TOC entry 2730 (class 2606 OID 65642)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (user_id);


-- Completed on 2021-03-29 22:30:45

--
-- PostgreSQL database dump complete
--


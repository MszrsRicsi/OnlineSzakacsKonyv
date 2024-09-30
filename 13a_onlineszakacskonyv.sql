-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2024. Sze 30. 17:45
-- Kiszolgáló verziója: 10.4.25-MariaDB
-- PHP verzió: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `13a_onlineszakacskonyv`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8_hungarian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Főétel'),
(2, 'Előétel'),
(3, 'Desszert'),
(4, 'Főzelék'),
(5, 'Leves'),
(6, 'Hús'),
(7, 'Saláta'),
(8, 'Tészta'),
(9, 'Tengeri herkentyűk'),
(10, 'Vegetáriánus'),
(11, 'Ital'),
(12, 'Reggeli'),
(13, 'Vacsora'),
(14, 'Köret'),
(15, 'Szósz'),
(16, 'Gyümölcs');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `recipes`
--

CREATE TABLE `recipes` (
  `id` int(11) NOT NULL,
  `catID` int(11) NOT NULL,
  `userID` varchar(40) COLLATE utf8_hungarian_ci NOT NULL,
  `title` varchar(25) COLLATE utf8_hungarian_ci NOT NULL,
  `description` text COLLATE utf8_hungarian_ci NOT NULL,
  `time` int(11) NOT NULL,
  `additions` varchar(50) COLLATE utf8_hungarian_ci NOT NULL,
  `calorie` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `recipes`
--

INSERT INTO `recipes` (`id`, `catID`, `userID`, `title`, `description`, `time`, `additions`, `calorie`) VALUES
(1, 1, 'befcc83d-839e-430b-a051-062d26fb6b05', 'Nincs', 'Nem is lesz', 25, 'Nincs ez se', 350),
(2, 3, 'befcc83d-839e-430b-a051-062d26fb6b05', 'Asd', '', 45, 'Asd', 1000),
(10, 1, 'befcc83d-839e-430b-a051-062d26fb6b05', '4334', '', 453, 'dsad', 534),
(14, 1, 'befcc83d-839e-430b-a051-062d26fb6b05', '645', '', 4636, 'sd', 6346),
(15, 1, 'befcc83d-839e-430b-a051-062d26fb6b05', '645', '', 4636, 'sd', 6346),
(17, 1, 'befcc83d-839e-430b-a051-062d26fb6b05', 'sad', '', 3232, '32523', 5325),
(18, 2, 'befcc83d-839e-430b-a051-062d26fb6b05', '3425324', '', 5325, '345345', 534534),
(19, 11, 'befcc83d-839e-430b-a051-062d26fb6b05', '53456e', '', 3425, '4324', 345);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` varchar(40) COLLATE utf8_hungarian_ci NOT NULL,
  `name` varchar(30) COLLATE utf8_hungarian_ci NOT NULL,
  `email` varchar(30) COLLATE utf8_hungarian_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8_hungarian_ci NOT NULL,
  `role` varchar(15) COLLATE utf8_hungarian_ci NOT NULL,
  `status` tinyint(1) NOT NULL,
  `password` varchar(40) COLLATE utf8_hungarian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `role`, `status`, `password`) VALUES
('45664fsafsdfsd', 'asd4564', 'deasfdasadasd', '34563445634', 'admin', 1, 'dasdast4ww'),
('asdasdasdasd342523sdad', 'teszt1', 'test1@gmail.com', '46346346', 'admin', 1, 'sadbdfada133'),
('befcc83d-839e-430b-a051-062d26fb6b05', 'Riherongy', 'riherongy@gmail.com', '34256342634', 'user', 1, '5503054db09108585089953a43a4b84856b9dff2'),
('ef412948-971d-47bd-972b-9d63ece93b5b', 'admin', 'admin@gmail.com', '53253245635', 'admin', 1, '5503054db09108585089953a43a4b84856b9dff2');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `recipes`
--
ALTER TABLE `recipes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `catID` (`catID`),
  ADD KEY `userID` (`userID`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT a táblához `recipes`
--
ALTER TABLE `recipes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `recipes`
--
ALTER TABLE `recipes`
  ADD CONSTRAINT `recipes_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `recipes_ibfk_2` FOREIGN KEY (`catID`) REFERENCES `categories` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

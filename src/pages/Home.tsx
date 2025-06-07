import styles from './Home.module.scss';

import Link from '../components/Shared/Link';

export default function Home() {
    return (
        <div className={styles.home}>
            <h1>Welcome to Trench Crusade Campaign Manager</h1>
            <p>
                Trench Crusade is a skirmish-scale tabletop miniatures game that
                plunges players deep into a horrifying alternate timeline.
                During the Crusades, a heretical band of Templars dared defy the
                Almighty, unleashing the forces of Hell upon the Earth. Over 800
                years later, in 1914, this merciless war between the forces of
                Heaven and Hell rages on in a cataclysmic struggle that will
                decide the very fate of humanity’s soul.
            </p>

            <nav>
                <ul>
                    <li>
                        <Link
                            to="https://www.trenchcrusade.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Official Website
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="https://www.trenchcrusade.com/rules"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Rules + Lore
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="https://www.trenchcrusade.com/news"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            News
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="https://www.trenchcrusade.com/community"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Community
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="https://www.trenchcrusade.com/contact"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Contact
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="https://www.trenchcrusade.com/shop"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Shop
                        </Link>
                    </li>
                </ul>
            </nav>

            <section>
                <h2>Get Started</h2>
                <ul>
                    <li>
                        <Link to="/campaigns">Browse Campaigns</Link>
                    </li>
                    <li>
                        <Link to="/warbands">View Warbands</Link>
                    </li>
                    <li>
                        <Link
                            to="https://www.trenchcrusade.com/rules"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Download Rules & Lore
                        </Link>
                    </li>
                </ul>
            </section>
        </div>
    );
}

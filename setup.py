from setuptools import setup


CLASSIFIERS = [
    'Development Status :: 2 - Pre-Alpha',
    "Intended Audience :: Developers",
    "Natural Language :: English",
    "License :: OSI Approved :: MIT License",
    "Operating System :: OS Independent",
    "Programming Language :: Python",
    "Programming Language :: Python :: 3",
    "Topic :: Software Development :: Libraries :: Python Modules",
]


if __name__ == "__main__":
    setup(
        name='mesh-github-server',
        description='Mesh Github Integration',
        license='MIT',
        url='meshstudio.io',
        version='0.1.0.dev0',
        author='Raphael Goyran',
        author_email='raphael@meshstudio.io',  # hey, I'm an optimist :)
        maintainer='Raphael Goyran',
        maintainer_email='raphael@meshstudio.io',
        keywords='mesh github integration api v3',
        long_description='Provides basic info for an authenticated Github user',
        packages=['mesh'],
        package_dir={"": "src"},
        zip_safe=False,
        classifiers=CLASSIFIERS,
        install_requires=['PyGithub', 'keyring', 'requests'],
    )

